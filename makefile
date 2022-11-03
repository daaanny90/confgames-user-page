CG_USER_PAGE_BUILD_TARGET="../build/user-page"
CG_USER_PAGE_FIREBASE_CREDS_FILE_TARGET="public/user_page_firebase_credentials.js"
CG_USER_PAGE_FIREBASE_CREDS_SRC_FILE="../infra/build/confware_frontend.key"

# Template will used to adapt json credentials as js for direct usage in the js
CREDENTIALS_TEMPLATE='\
const firebaseConfig = ${CG_USER_PAGE_SRC_CREDS}; \
export default firebaseConfig \
'

export CG_USER_PAGE_SRC_CREDS=$(shell cat $(CG_USER_PAGE_FIREBASE_CREDS_SRC_FILE))

test:
	@[ -f "$(CG_USER_PAGE_FIREBASE_CREDS_SRC_FILE)" ] || echo "❌ MISSING: $(CG_USER_PAGE_FIREBASE_CREDS_SRC_FILE)"
	@[ -f "$(CG_USER_PAGE_FIREBASE_CREDS_FILE_TARGET)" ] || echo "❌ MISSING: $(CG_USER_PAGE_FIREBASE_CREDS_FILE_TARGET)"
	@[ -d "$(CG_USER_PAGE_BUILD_TARGET)" ] || echo "💡️ MISSING-DIRECTORY: $(CG_USER_PAGE_BUILD_TARGET) (properly correct if you are in a clean state)"

credentials:
	@[ -f "$(CG_USER_PAGE_FIREBASE_CREDS_SRC_FILE)" ] || (echo "❌ MISSING: $(CG_USER_PAGE_FIREBASE_CREDS_SRC_FILE)"; exit 1)
	@if [ -f $(CG_USER_PAGE_FIREBASE_CREDS_FILE_TARGET) ]; then \
		rm $(CG_USER_PAGE_FIREBASE_CREDS_FILE_TARGET); \
  	fi
	@echo  $(CREDENTIALS_TEMPLATE) | envsubst > $(CG_USER_PAGE_FIREBASE_CREDS_FILE_TARGET)

build:
	@rm -rf $(CG_USER_PAGE_BUILD_TARGET)
	@mkdir -p $(CG_USER_PAGE_BUILD_TARGET)
	@cp -Rf public/* $(CG_USER_PAGE_BUILD_TARGET)

clean:
	@[ ! -f $(CG_USER_PAGE_FIREBASE_CREDS_FILE_TARGET) ] || rm $(CG_USER_PAGE_FIREBASE_CREDS_FILE_TARGET);
	@[ ! -d $(CG_USER_PAGE_BUILD_TARGET) ] || rm -rf $(CG_USER_PAGE_BUILD_TARGET);

USER_PAGE:
	@make clean
	@make credentials
	@make test
	@make build
